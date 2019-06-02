import { Injectable } from '@angular/core';
import { Observable, merge } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { ProjectSearchResult } from './project-search-result';
import { ProjectsApiService } from '../core/services/gitlab-api/projects-api.service';
import { GroupsApiService } from '../core/services/gitlab-api/groups-api.service';
import { Project } from '../core/services/gitlab-api/models/project';
import { FileSearchResult } from '../core/services/gitlab-api/models/file-search-result';

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    private static readonly ALL_GROUPS_SEARCH_ID = '-1';

    constructor(private groupsApiService: GroupsApiService, private projectsApiService: ProjectsApiService) {}

    search(groupId: number, projectNameFilterTerm?: string, searchText?: string): Observable<ProjectSearchResult> {
        return this.searchProjects(groupId, projectNameFilterTerm)
            .pipe(mergeMap(projects => {
                const projectsSearch$ = projects.map(project => this.searchInProject(project, searchText));
                return merge(...projectsSearch$);
            }));
    }

    private searchProjects(groupId: string|number, projectNameFilterTerm?: string) {
        if (groupId.toString() === SearchService.ALL_GROUPS_SEARCH_ID) {
            return this.projectsApiService.getProjects(projectNameFilterTerm);
        } else {
            return this.groupsApiService.getProjectsOfGroupDeep(groupId, projectNameFilterTerm);
        }
    }

    private searchInProject(project: Project, searchText: string): Observable<ProjectSearchResult> {
        return this.projectsApiService.searchInProject(project.id, searchText)
            .pipe(map(results => ({
                project,
                fileSearchResults: this.groupSearchResultsByFilename(results)
            })));
    }

    private groupSearchResultsByFilename(fileSearchResults: FileSearchResult[]): Map<string, FileSearchResult[]> {
        const results = new Map<string, FileSearchResult[]>();

        fileSearchResults.forEach(element => {
            if (!results.has(element.filename)) {
                results.set(element.filename, [ element ]);
            } else {
                results.get(element.filename).push(element);
            }
        });

        return results;
    }
}
